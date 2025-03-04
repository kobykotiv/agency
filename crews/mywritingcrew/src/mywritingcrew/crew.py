from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

@CrewBase
class Mywritingcrew():
    """AI Novelist Crew for generating stories from input tokens"""

    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    # Agent definitions
    @agent
    def token_parser(self) -> Agent:
        return Agent(
            config=self.agents_config['token_parser'],
            verbose=True
        )

    @agent
    def story_architect(self) -> Agent:
        return Agent(
            config=self.agents_config['story_architect'],
            verbose=True
        )

    @agent
    def character_developer(self) -> Agent:
        return Agent(
            config=self.agents_config['character_developer'],
            verbose=True
        )

    @agent
    def world_builder(self) -> Agent:
        return Agent(
            config=self.agents_config['world_builder'],
            verbose=True
        )

    @agent
    def plot_weaver(self) -> Agent:
        return Agent(
            config=self.agents_config['plot_weaver'],
            verbose=True
        )

    @agent
    def dialogue_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config['dialogue_specialist'],
            verbose=True
        )

    @agent
    def theme_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['theme_analyst'],
            verbose=True
        )

    @agent
    def writing_stylist(self) -> Agent:
        return Agent(
            config=self.agents_config['writing_stylist'],
            verbose=True
        )

    @agent
    def continuity_manager(self) -> Agent:
        return Agent(
            config=self.agents_config['continuity_manager'],
            verbose=True
        )

    @agent
    def quality_assessor(self) -> Agent:
        return Agent(
            config=self.agents_config['quality_assessor'],
            verbose=True
        )

    @agent
    def story_librarian(self) -> Agent:
        return Agent(
            config=self.agents_config['story_librarian'],
            verbose=True
        )

    # Task definitions with dependencies
    @task
    def parse_input_task(self) -> Task:
        return Task(
            config=self.tasks_config['parse_input_task'],
            output_file='working/01_token_mapping.json'
        )

    @task
    def design_structure_task(self) -> Task:
        return Task(
            config=self.tasks_config['design_structure_task'],
            output_file='working/02_story_structure.md',
            context=lambda: self.parse_input_task.output
        )

    @task
    def create_characters_task(self) -> Task:
        return Task(
            config=self.tasks_config['create_characters_task'],
            output_file='working/03_character_profiles.md',
            context=lambda: [
                self.parse_input_task.output,
                self.design_structure_task.output
            ]
        )

    @task
    def build_world_task(self) -> Task:
        return Task(
            config=self.tasks_config['build_world_task'],
            output_file='working/04_world_building.md',
            context=lambda: [
                self.parse_input_task.output,
                self.design_structure_task.output,
                self.create_characters_task.output
            ]
        )

    @task
    def develop_scenes_task(self) -> Task:
        return Task(
            config=self.tasks_config['develop_scenes_task'],
            output_file='working/05_scene_sequence.md',
            context=lambda: [
                self.design_structure_task.output,
                self.create_characters_task.output,
                self.build_world_task.output
            ]
        )

    @task
    def create_dialogue_task(self) -> Task:
        return Task(
            config=self.tasks_config['create_dialogue_task'],
            output_file='working/06_dialogue_scripts.md',
            context=lambda: [
                self.create_characters_task.output,
                self.develop_scenes_task.output
            ]
        )

    @task
    def analyze_themes_task(self) -> Task:
        return Task(
            config=self.tasks_config['analyze_themes_task'],
            output_file='working/07_theme_analysis.md',
            context=lambda: [
                self.parse_input_task.output,
                self.design_structure_task.output,
                self.develop_scenes_task.output
            ]
        )

    @task
    def refine_prose_task(self) -> Task:
        return Task(
            config=self.tasks_config['refine_prose_task'],
            output_file='working/08_refined_narrative.md',
            context=lambda: [
                self.develop_scenes_task.output,
                self.create_dialogue_task.output,
                self.analyze_themes_task.output
            ]
        )

    @task
    def verify_consistency_task(self) -> Task:
        return Task(
            config=self.tasks_config['verify_consistency_task'],
            output_file='working/09_consistency_report.md',
            context=lambda: [
                self.design_structure_task.output,
                self.create_characters_task.output,
                self.build_world_task.output,
                self.develop_scenes_task.output,
                self.refine_prose_task.output
            ]
        )

    @task
    def assess_quality_task(self) -> Task:
        return Task(
            config=self.tasks_config['assess_quality_task'],
            output_file='working/10_quality_assessment.md',
            context=lambda: [
                self.refine_prose_task.output,
                self.verify_consistency_task.output
            ]
        )

    @task
    def update_library_task(self) -> Task:
        return Task(
            config=self.tasks_config['update_library_task'],
            output_file='working/11_library_update.md',
            context=lambda: [
                self.design_structure_task.output,
                self.create_characters_task.output,
                self.build_world_task.output,
                self.develop_scenes_task.output,
                self.refine_prose_task.output,
                self.assess_quality_task.output
            ]
        )

    @crew
    def crew(self) -> Crew:
        """Creates the AI Novelist crew for story generation"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True
        )
