# Documentation Style Guide

## Overview
This style guide establishes standards for writing clear, consistent, and effective documentation for the CrewAI platform. Following these guidelines ensures a unified voice and high-quality documentation across all content types.

## General Principles

### 1. Voice and Tone
- Use clear, direct language
- Write in active voice
- Be professional but conversational
- Focus on user goals and tasks
- Avoid jargon and unnecessary technical terms
- Use inclusive language

### 2. Writing Style
- Write concise, scannable content
- Use short paragraphs (3-4 sentences max)
- Break content into logical sections
- Include relevant examples
- Link to related content
- Highlight important information

### 3. Content Structure
```markdown
# Page Title
Brief introduction (1-2 sentences)

## Overview
High-level explanation of the topic

## Prerequisites
- Required knowledge
- Required tools/software
- Required permissions

## Content Sections
Clear headings that follow a logical progression

## Examples
Practical, real-world examples

## Related Resources
Links to related documentation
```

## Formatting Guidelines

### 1. Headers
```markdown
# H1: Page Title (One per page)
## H2: Major Sections
### H3: Subsections
#### H4: Additional Breakdowns
```

### 2. Code Examples
- Use syntax highlighting
- Include comments
- Show complete, working examples
- Explain key parts
```typescript
// Example of good code formatting
function calculateTotal(items: Item[]): number {
  // Calculate sum of all item prices
  return items.reduce((total, item) => total + item.price, 0);
}
```

### 3. Lists
- Use bullets for unordered lists
- Use numbers for sequential steps
- Keep list items parallel
- Start with action verbs
- Maintain consistent punctuation

### 4. Tables
| Use | Don't Use |
|-----|-----------|
| Active voice | Passive voice |
| Clear language | Jargon |
| Specific examples | Vague descriptions |
| Consistent terminology | Varying terms |

## Content Types

### 1. Conceptual Documentation
- Explain the "why" and "what"
- Include diagrams and illustrations
- Link to related tutorials
- Provide real-world examples

### 2. Task-based Documentation
- Clear, numbered steps
- One action per step
- Include expected results
- Note any prerequisites
- Show examples of success/failure

### 3. Reference Documentation
- Consistent format for each entry
- Complete parameter descriptions
- Example usage
- Return values
- Error handling

### 4. Tutorials
- Clear learning objectives
- Step-by-step instructions
- Complete code examples
- Expected outcomes
- Troubleshooting tips

## Naming Conventions

### 1. File Names
- Use lowercase
- Separate words with hyphens
- Be descriptive and concise
- Include relevant category prefixes
```
getting-started-guide.md
api-authentication.md
troubleshooting-common-errors.md
```

### 2. Code Examples
- Use meaningful variable names
- Follow language conventions
- Be consistent with casing
- Use clear function names

## Images and Media

### 1. Screenshots
- Clear and focused
- Annotated when necessary
- Compressed for web
- Include alt text
- Updated when UI changes

### 2. Diagrams
- Simple and clear
- Consistent style
- Proper labeling
- Include text description
- Use standard notation

## Best Practices

### 1. Documentation Updates
- Review regularly
- Update for new versions
- Remove obsolete content
- Maintain changelog
- Version documentation

### 2. Accessibility
- Use semantic markup
- Provide alt text
- Ensure color contrast
- Use descriptive links
- Support keyboard navigation

### 3. SEO Optimization
- Descriptive titles
- Clear meta descriptions
- Logical URL structure
- Proper heading hierarchy
- Internal linking

## Review Checklist
- [ ] Content is accurate and up-to-date
- [ ] Follows style guide formatting
- [ ] Code examples are tested
- [ ] Links are working
- [ ] Images have alt text
- [ ] Spelling and grammar checked
- [ ] Technical accuracy verified
- [ ] Accessibility guidelines met