import os
import gradio as gr
import json
from typing import Dict, List, Optional
from fastapi import FastAPI, WebSocket
from redis import Redis
from crewai import Agent, Task, Crew
import asyncio
import httpx

# Initialize FastAPI and Redis
app = FastAPI()
redis = Redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))

# API configuration
API_URL = os.getenv("API_URL", "http://localhost:8000")
WS_URL = os.getenv("WS_URL", "ws://localhost:8001")

class CrewManager:
    def __init__(self):
        self.crews: Dict[str, Crew] = {}
        self.http_client = httpx.AsyncClient()
    
    async def create_crew(self, name: str, agents_config: List[Dict], tasks_config: List[Dict]) -> str:
        """Create a new crew with specified agents and tasks"""
        try:
            # Create agents from configuration
            agents = [
                Agent(
                    name=agent["name"],
                    role=agent["role"],
                    goal=agent["goal"],
                    backstory=agent["backstory"],
                    allow_delegation=agent.get("allow_delegation", True),
                    llm=self._get_llm(agent.get("llm_config", {}))
                )
                for agent in agents_config
            ]
            
            # Create tasks from configuration
            tasks = [
                Task(
                    description=task["description"],
                    agent=next(a for a in agents if a.name == task["agent"]),
                    context=task.get("context", ""),
                    expected_output=task.get("expected_output", "")
                )
                for task in tasks_config
            ]
            
            # Create and store crew
            crew = Crew(
                agents=agents,
                tasks=tasks,
                process=tasks_config[0].get("process", "sequential")
            )
            
            crew_id = name.lower().replace(" ", "_")
            self.crews[crew_id] = crew
            return crew_id
            
        except Exception as e:
            raise Exception(f"Failed to create crew: {str(e)}")
    
    def _get_llm(self, config: Dict) -> any:
        """Configure LLM based on settings"""
        provider = config.get("provider", "ollama")
        if provider == "openai":
            from langchain.chat_models import ChatOpenAI
            return ChatOpenAI(
                api_key=config.get("api_key", os.getenv("OPENAI_API_KEY")),
                model=config.get("model", "gpt-4")
            )
        else:  # default to ollama
            from langchain.llms import Ollama
            return Ollama(
                base_url=config.get("base_url", "http://localhost:11434"),
                model=config.get("model", "llama2")
            )

# Initialize crew manager
crew_manager = CrewManager()

def create_gradio_interface():
    """Create the Gradio interface for crew management and chat"""
    
    # Crew creation interface
    with gr.Blocks() as interface:
        gr.Markdown("# CrewAI Management Interface")
        
        with gr.Tab("Create Crew"):
            crew_name = gr.Textbox(label="Crew Name")
            
            with gr.Column():
                gr.Markdown("### Agents Configuration")
                agent_name = gr.Textbox(label="Agent Name")
                agent_role = gr.Textbox(label="Role")
                agent_goal = gr.Textbox(label="Goal")
                agent_backstory = gr.Textbox(label="Backstory")
                agent_llm = gr.Dropdown(
                    choices=["ollama", "openai"],
                    label="LLM Provider"
                )
                agent_model = gr.Textbox(
                    label="Model Name",
                    placeholder="llama2 for Ollama, gpt-4 for OpenAI"
                )
                add_agent_btn = gr.Button("Add Agent")
            
            with gr.Column():
                gr.Markdown("### Tasks Configuration")
                task_description = gr.Textbox(label="Task Description")
                task_agent = gr.Dropdown(label="Assign to Agent")
                task_context = gr.Textbox(label="Context (Optional)")
                task_output = gr.Textbox(label="Expected Output (Optional)")
                add_task_btn = gr.Button("Add Task")
            
            create_crew_btn = gr.Button("Create Crew")
            status_output = gr.Textbox(label="Status")
        
        with gr.Tab("Chat"):
            crew_select = gr.Dropdown(
                choices=lambda: list(crew_manager.crews.keys()),
                label="Select Crew"
            )
            chatbot = gr.Chatbot()
            msg = gr.Textbox()
            clear = gr.Button("Clear")
        
        # Event handlers
        def add_agent(name, role, goal, backstory, llm, model):
            # Store agent configuration
            return f"Added agent: {name}"
        
        def add_task(description, agent, context, output):
            # Store task configuration
            return f"Added task for agent: {agent}"
        
        async def create_crew_handler(name):
            try:
                # Get stored configurations and create crew
                crew_id = await crew_manager.create_crew(name, [], [])
                return f"Created crew: {crew_id}"
            except Exception as e:
                return f"Error: {str(e)}"
        
        async def chat(message, history, crew_id):
            if not crew_id:
                return "Please select a crew first."
            
            crew = crew_manager.crews.get(crew_id)
            if not crew:
                return "Crew not found."
            
            try:
                # Process message with crew
                response = await crew.process_message(message)
                history.append((message, response))
                return history
            except Exception as e:
                return f"Error: {str(e)}"
        
        # Connect event handlers
        add_agent_btn.click(
            add_agent,
            inputs=[agent_name, agent_role, agent_goal, agent_backstory, agent_llm, agent_model],
            outputs=[status_output]
        )
        
        add_task_btn.click(
            add_task,
            inputs=[task_description, task_agent, task_context, task_output],
            outputs=[status_output]
        )
        
        create_crew_btn.click(
            create_crew_handler,
            inputs=[crew_name],
            outputs=[status_output]
        )
        
        msg.submit(
            chat,
            inputs=[msg, chatbot, crew_select],
            outputs=[chatbot]
        )
        
        clear.click(lambda: None, None, chatbot)
    
    return interface

# Launch the interface
if __name__ == "__main__":
    interface = create_gradio_interface()
    interface.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False
    )