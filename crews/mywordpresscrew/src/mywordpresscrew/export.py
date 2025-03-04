import sys
sys.path.append(".")
import yaml
from crewai import Crew

from mywordpresscrew.crew import Mywordpresscrew

def export_crew_to_yaml(crew: Crew, filename: str):
    # \"\"\"Exports a Crew object to a YAML file.\"\"\"
    crew_data = {
        "agents": [],
        "tasks": []
    }

    for agent in crew.agents:
        crew_data["agents"].append({
            "role": agent.role,
            "goal": agent.goal,
            "backstory": agent.backstory,
            "tools": [tool.__doc__ for tool in agent.tools],
            "llm": agent.llm.__dict__ if agent.llm else None
        })

    for task in crew.tasks:
        crew_data["tasks"].append({
            "description": task.description,
            "agent": task.agent.role if task.agent else None
        })

    with open(filename, "w") as yaml_file:
        yaml.dump(crew_data, yaml_file, indent=4)

if __name__ == "__main__":
    my_crew = Mywordpresscrew().crew()
    export_crew_to_yaml(my_crew, "my_crew.yaml")
    print("Crew exported to my_crew.yaml")