#!/usr/bin/env python
import sys
import warnings
from datetime import datetime

from personasynth.crew import PersonaSynth

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run():
    """
    Run the PersonaSynth crew to analyze social media trends and emotions.
    """
    inputs = {
        'target_communities': [
            'programming',
            'technology',
            'gaming',
            'anime',
            'science'
        ],
        'emotion_thresholds': {
            'min_intensity': 3,
            'min_authenticity': 5,
            'min_resonance': 4
        },
        'trend_parameters': {
            'timeframe': 'last_week',
            'min_engagement': 100,
            'platform_focus': ['reddit', 'twitter', 'discord']
        },
        'current_year': str(datetime.now().year)
    }
    
    try:
        PersonaSynth().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")

def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        'target_communities': ['programming', 'technology'],
        'emotion_thresholds': {
            'min_intensity': 3,
            'min_authenticity': 5
        }
    }
    try:
        PersonaSynth().crew().train(
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
        PersonaSynth().crew().replay(task_id=sys.argv[1])
    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        'target_communities': ['programming'],
        'emotion_thresholds': {
            'min_intensity': 3,
            'min_authenticity': 5
        }
    }
    try:
        PersonaSynth().crew().test(
            n_iterations=int(sys.argv[1]),
            openai_model_name=sys.argv[2],
            inputs=inputs
        )
    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")

if __name__ == "__main__":
    run()
