# AI Novelist Crew

A sophisticated multi-agent system for generating novel-length stories from input tokens, powered by [crewAI](https://crewai.com). This system employs 11 specialized AI agents working in concert to transform basic story elements into fully-realized narratives.

## System Overview

The AI Novelist Crew consists of the following specialized agents:

1. **Story Architect** - High-level plot and structure design
2. **Character Developer** - Character creation and arc management
3. **World Builder** - Setting and universe details
4. **Plot Weaver** - Scene sequencing and narrative flow
5. **Dialogue Specialist** - Conversation and interaction design
6. **Theme Analyst** - Thematic consistency and symbolism
7. **Writing Stylist** - Prose quality and voice consistency
8. **Continuity Manager** - Story consistency and logic checks
9. **Token Parser** - Input processing and story element mapping
10. **Quality Assessor** - Output validation and refinement
11. **Story Librarian** - Template and element management

## Installation

Ensure you have Python >=3.10 <3.13 installed. This project uses [UV](https://docs.astral.sh/uv/) for dependency management.

1. Install UV:
```bash
pip install uv
```

2. Install dependencies:
```bash
crewai install
```

## Configuration

The system requires an OpenAI API key for operation. Setup your environment:

1. Copy `.env.example` to `.env`
2. Add your OpenAI API key:
```
MODEL=ollama/llama3.1
API_BASE=http://localhost:11434
```

## Usage

The system accepts story tokens in JSON format with the following structure:

```json
{
  "genre": "science_fiction",
  "theme": "redemption",
  "characters": [
    {
      "name": "Alex",
      "role": "protagonist",
      "traits": ["determined", "brilliant", "haunted"]
    }
  ],
  "setting": {
    "time": "future",
    "place": "space_colony",
    "atmosphere": "dystopian"
  },
  "plot_elements": [
    "artificial_intelligence",
    "ethical_dilemma",
    "personal_growth"
  ]
}
```

### Generate a Story

Run the crew to generate a story:

```bash
crewai run
```

The system will:
1. Parse input tokens into story elements
2. Design narrative structure
3. Develop characters and world
4. Create scene sequences
5. Generate dialogue
6. Analyze and enhance themes
7. Refine prose
8. Verify consistency
9. Assess quality
10. Update story templates

Output files are generated in the `working/` directory:
- `01_token_mapping.json` - Initial token analysis
- `02_story_structure.md` - High-level narrative design
- `03_character_profiles.md` - Character details
- `04_world_building.md` - Setting information
- `05_scene_sequence.md` - Detailed scene breakdown
- `06_dialogue_scripts.md` - Key conversations
- `07_theme_analysis.md` - Thematic elements
- `08_refined_narrative.md` - Polished story content
- `09_consistency_report.md` - Logic verification
- `10_quality_assessment.md` - Final evaluation
- `11_library_update.md` - Template additions
- `final_story.md` - Complete generated story

### Training and Testing

Train the crew with sample data:
```bash
crewai train <iterations> <output_file>
```

Test the crew's performance:
```bash
crewai test <iterations> <model_name>
```

Replay a specific task:
```bash
crewai replay <task_id>
```

## Output Quality

The system implements several quality control measures:
- Consistent character voice and behavior
- Logical plot progression
- Thematic coherence
- Natural dialogue
- Proper pacing
- Grammar and style consistency

## Extending the System

The crew can be extended by:
1. Adding new specialized agents
2. Creating custom story templates
3. Implementing additional quality checks
4. Expanding the token vocabulary
5. Adding genre-specific guidance

## Support

For support and documentation:
- [CrewAI Documentation](https://docs.crewai.com)
- [GitHub Repository](https://github.com/joaomdmoura/crewai)
- [Discord Community](https://discord.com/invite/X4JWnZnxPb)
- [Documentation Chat](https://chatg.pt/DWjSBZn)
