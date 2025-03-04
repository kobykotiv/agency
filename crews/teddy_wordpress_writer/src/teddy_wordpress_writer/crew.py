from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

@CrewBase
class TeddyWordpressWriter():
    """TeddyWordpressWriter crew for WordPress optimization and content creation"""

    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    @agent
    def wordpress_optimizer(self) -> Agent:
        return Agent(
            config=self.agents_config['wordpress_optimizer'],
            verbose=True
        )

    @agent
    def content_writer(self) -> Agent:
        return Agent(
            config=self.agents_config['content_writer'],
            verbose=True
        )

    @agent
    def social_media_strategist(self) -> Agent:
        return Agent(
            config=self.agents_config['social_media_strategist'],
            verbose=True
        )

    @agent
    def content_editor(self) -> Agent:
        return Agent(
            config=self.agents_config['content_editor'],
            verbose=True
        )

    @task
    def wordpress_setup_task(self) -> Task:
        return Task(
            config=self.tasks_config['wordpress_setup_task'],
            output_file='wordpress_setup.md'
        )

    @task
    def content_creation_task(self) -> Task:
        return Task(
            config=self.tasks_config['content_creation_task'],
            output_file='content_draft.md'
        )

    @task
    def social_media_strategy_task(self) -> Task:
        return Task(
            config=self.tasks_config['social_media_strategy_task'],
            output_file='social_media_strategy.md'
        )

    @task
    def content_review_task(self) -> Task:
        return Task(
            config=self.tasks_config['content_review_task'],
            output_file='content_review.md'
        )

    @crew
    def crew(self) -> Crew:
        """Creates the TeddyWordpressWriter crew for content optimization and creation"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True
        )
