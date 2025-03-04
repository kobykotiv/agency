#!/usr/bin/env python
import sys
import warnings
from datetime import datetime

from teddy_wordpress_writer.crew import TeddyWordpressWriter

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run():
    """
    Run the WordPress content creation and optimization crew.
    """
    inputs = {
        'topic': 'WordPress Content Strategy',
        'current_year': str(datetime.now().year),
        'content_type': 'semi-biographical',
        'target_audience': 'general readers interested in personal growth and technology',
        'seo_keywords': 'wordpress optimization, social media growth, content strategy',
        'content_tone': 'engaging and relatable',
        'wordpress_focus': 'SEO and social media optimization',
        'target_platforms': 'WordPress, Twitter, LinkedIn, Facebook'
    }
    
    try:
        TeddyWordpressWriter().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")

def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        'topic': 'WordPress Content Strategy',
        'content_type': 'semi-biographical',
        'target_audience': 'general readers',
        'seo_keywords': 'wordpress, social media, content'
    }
    try:
        TeddyWordpressWriter().crew().train(
            n_iterations=int(sys.argv[1]),
            filename=sys.argv[2],
            inputs=inputs
        )
    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        TeddyWordpressWriter().crew().replay(task_id=sys.argv[1])
    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        'topic': 'WordPress Content Strategy',
        'content_type': 'semi-biographical',
        'target_audience': 'general readers',
        'seo_keywords': 'wordpress, social media, content'
    }
    try:
        TeddyWordpressWriter().crew().test(
            n_iterations=int(sys.argv[1]),
            openai_model_name=sys.argv[2],
            inputs=inputs
        )
    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")

if __name__ == "__main__":
    run()
