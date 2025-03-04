from typing import Dict, List
import re
from dataclasses import dataclass

@dataclass
class EmotionMetrics:
    intensity: float
    sentiment: float
    authenticity: float
    resonance: float

class SageAdviceAnalyzer:
    """Tool for gathering and analyzing 'sage' advice from online communities"""

    def __init__(self):
        self.emotion_patterns = {
            'intensity': [
                r'!{2,}',           # Multiple exclamation marks
                r'[A-Z]{3,}',       # CAPS LOCK
                r'(?i)very|really|extremely|absolutely'  # Intensity words
            ],
            'authenticity': [
                r'(?i)honestly|truthfully|genuinely',
                r'(?i)in my experience',
                r'(?i)i\'ve found that'
            ],
            'resonance': [
                r'(?i)relatable|same here|me too',
                r'(?i)understand|get it|feel you'
            ]
        }

    def analyze_text(self, text: str) -> EmotionMetrics:
        """Analyze text for emotional content and return metrics"""
        
        # Calculate intensity (0-10)
        intensity = min(10, sum(
            len(re.findall(pattern, text))
            for pattern in self.emotion_patterns['intensity']
        ))

        # Calculate sentiment (-1 to 1)
        # Simple implementation - could be enhanced with ML-based sentiment analysis
        positive_words = len(re.findall(r'(?i)good|great|awesome|love|happy', text))
        negative_words = len(re.findall(r'(?i)bad|terrible|hate|angry|sad', text))
        total_words = len(text.split())
        sentiment = (positive_words - negative_words) / max(1, total_words)

        # Calculate authenticity (0-10)
        authenticity = min(10, sum(
            2 * len(re.findall(pattern, text))
            for pattern in self.emotion_patterns['authenticity']
        ))

        # Calculate resonance (0-10)
        resonance = min(10, sum(
            2 * len(re.findall(pattern, text))
            for pattern in self.emotion_patterns['resonance']
        ))

        return EmotionMetrics(
            intensity=intensity,
            sentiment=max(-1, min(1, sentiment)),  # Clamp between -1 and 1
            authenticity=authenticity,
            resonance=resonance
        )

    def process_advice(self, text: str, context: Dict = None) -> Dict:
        """Process a piece of advice and return analysis results"""
        metrics = self.analyze_text(text)
        
        return {
            'text': text,
            'context': context or {},
            'metrics': {
                'intensity': metrics.intensity,
                'sentiment': metrics.sentiment,
                'authenticity': metrics.authenticity,
                'resonance': metrics.resonance,
                'overall_score': (
                    metrics.intensity * 0.3 +
                    (metrics.sentiment + 1) * 5 * 0.2 +  # Convert -1:1 to 0:10
                    metrics.authenticity * 0.25 +
                    metrics.resonance * 0.25
                )
            }
        }

    def batch_process(self, texts: List[str], contexts: List[Dict] = None) -> List[Dict]:
        """Process multiple pieces of advice"""
        if contexts is None:
            contexts = [None] * len(texts)
        
        return [
            self.process_advice(text, context)
            for text, context in zip(texts, contexts)
        ]

# Example usage:
"""
analyzer = SageAdviceAnalyzer()
advice = "HONESTLY, I've found that spending time coding really helps me relax! It's amazing!!"
result = analyzer.process_advice(advice, {"source": "reddit", "community": "programming"})
print(result)
"""
