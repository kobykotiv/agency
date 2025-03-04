#!/usr/bin/env python
import json
import os
import sys
import warnings
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Union

from mywritingcrew.crew import Mywritingcrew

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def ensure_working_directory():
    """Ensure the working directory exists for story generation artifacts."""
    working_dir = Path("working")
    working_dir.mkdir(exist_ok=True)
    return working_dir

def validate_tokens(tokens: Dict[str, Union[str, List[str]]]) -> bool:
    """Validate the input tokens for story generation."""
    required_fields = ['genre', 'theme', 'characters']
    return all(field in tokens for field in required_fields)

def run():
    """
    Run the AI novelist crew to generate a story from input tokens.
    """
    working_dir = ensure_working_directory()

    # Example token structure - in practice, this would come from user input
    tokens = {
        'genre': 'science_fiction',
        'theme': 'redemption',
        'characters': [
            {
                'name': 'Alex',
                'role': 'protagonist',
                'traits': ['determined', 'brilliant', 'haunted']
            }
        ],
        'setting': {
            'time': 'future',
            'place': 'space_colony',
            'atmosphere': 'dystopian'
        },
        'plot_elements': [
            'artificial_intelligence',
            'ethical_dilemma',
            'personal_growth'
        ]
    }

    if not validate_tokens(tokens):
        raise ValueError("Invalid token structure. Required fields: genre, theme, characters")

    inputs = {
        'tokens': json.dumps(tokens, indent=2),
        'timestamp': datetime.now().isoformat(),
        'output_dir': str(working_dir)
    }

    try:
        result = Mywritingcrew().crew().kickoff(inputs=inputs)
        
        # Combine all generated content into final story
        story_path = working_dir / "final_story.md"
        with open(story_path, 'w') as f:
            f.write("# Generated Story\n\n")
            
            # Add metadata
            f.write("## Metadata\n")
            f.write(f"Generated: {inputs['timestamp']}\n")
            f.write(f"Genre: {tokens['genre']}\n")
            f.write(f"Theme: {tokens['theme']}\n\n")
            
            # Add story content
            narrative_path = working_dir / "08_refined_narrative.md"
            if narrative_path.exists():
                with open(narrative_path) as narrative:
                    f.write(narrative.read())
            
            # Add quality report
            f.write("\n## Quality Assessment\n")
            quality_path = working_dir / "10_quality_assessment.md"
            if quality_path.exists():
                with open(quality_path) as quality:
                    f.write(quality.read())
        
        print(f"\nStory generated successfully! Output saved to: {story_path}")
        return result

    except Exception as e:
        raise Exception(f"An error occurred while generating the story: {e}")

def train():
    """
    Train the AI novelist crew for a given number of iterations.
    """
    tokens = {
        'genre': 'fantasy',
        'theme': 'coming_of_age',
        'characters': [
            {
                'name': 'Maya',
                'role': 'protagonist',
                'traits': ['curious', 'brave', 'inexperienced']
            }
        ]
    }

    inputs = {
        'tokens': json.dumps(tokens, indent=2)
    }

    try:
        Mywritingcrew().crew().train(
            n_iterations=int(sys.argv[1]), 
            filename=sys.argv[2], 
            inputs=inputs
        )
    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the AI novelist crew execution from a specific task.
    """
    try:
        Mywritingcrew().crew().replay(task_id=sys.argv[1])
    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the AI novelist crew execution and returns the results.
    """
    tokens = {
        'genre': 'mystery',
        'theme': 'justice',
        'characters': [
            {
                'name': 'Detective Chen',
                'role': 'protagonist',
                'traits': ['analytical', 'persistent', 'jaded']
            }
        ]
    }

    inputs = {
        'tokens': json.dumps(tokens, indent=2)
    }

    try:
        Mywritingcrew().crew().test(
            n_iterations=int(sys.argv[1]),
            openai_model_name=sys.argv[2],
            inputs=inputs
        )
    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")
