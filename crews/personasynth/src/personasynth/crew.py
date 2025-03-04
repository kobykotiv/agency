from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

@CrewBase
class PersonaSynth():
    """PersonaSynth crew for gathering and analyzing social media conversation topics"""

    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    @agent
    def trend_analyzer(self) -> Agent:
        return Agent(
            config=self.agents_config['trend_analyzer'],
            verbose=True
        )

    @agent
    def dork_whisperer(self) -> Agent:
        return Agent(
            config=self.agents_config['dork_whisperer'],
            verbose=True
        )

    @agent
    def emotion_quantifier(self) -> Agent:
        return Agent(
            config=self.agents_config['emotion_quantifier'],
            verbose=True
        )

    @task
    def trend_research_task(self) -> Task:
        return Task(
            config=self.tasks_config['trend_research_task'],
            output_file='trend_analysis.md'
        )

    @task
    def sage_advice_task(self) -> Task:
        return Task(
            config=self.tasks_config['sage_advice_task'],
            output_file='sage_insights.md'
        )

    @task
    def emotion_analysis_task(self) -> Task:
        return Task(
            config=self.tasks_config['emotion_analysis_task'],
            output_file='emotion_metrics.md'
        )

    @crew
    def crew(self) -> Crew:
        """Creates the PersonaSynth crew for analyzing social media trends and emotions"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True
        )
