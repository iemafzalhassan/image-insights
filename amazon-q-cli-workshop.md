# Amazon Q Developer CLI Workshop Plan: "Supercharge Your CLI Experience with Amazon Q"

## Workshop Overview

**Title:** "Command Line Superpowers: Building Modern Apps with Amazon Q Developer CLI"

**Tagline:** "Transform your terminal from a command executor to an AI-powered development partner"

**Duration:** 2 hours

**Target Audience:** Developers, DevOps engineers, cloud architects, and technical decision-makers

## Workshop Structure

### Section 1: Introduction (15 minutes)
- Your personal journey as a devops and advocate
- The evolution of devops tools and the CLI
- Introduction to Amazon Q Developer and its ecosystem
- Workshop goals and what participants will build

### Section 2: Getting Started with Amazon Q CLI (20 minutes)
- Installation and setup
- Basic commands and navigation
- First interactions with natural language
- Demo: Solving common developer & devops tasks with conversational AI

### Section 3: Building a Serverless App with Amazon Q CLI (40 minutes)
- **Hands-on Project:** "ImageInsights" - A serverless image analysis application
- Using Amazon Q CLI to:
  - Generate infrastructure code (CloudFormation/CDK)
  - Write Lambda functions for image processing
  - Set up API Gateway endpoints
  - Configure S3 buckets with proper permissions
  - Implement Amazon Rekognition integration

### Section 4: Extending Amazon Q with MCP (30 minutes)
- Introduction to Model Context Protocol (MCP)
- Configuring MCP servers for enhanced capabilities
- Demo: Using AWS MCP servers for specialized tasks
  - AWS Documentation server for best practices
  - AWS Terraform server for infrastructure optimization
  - AWS Lambda server for serverless patterns
- Hands-on: Participants configure their own MCP server

### Section 5: Advanced Techniques & Real-world Use Cases (15 minutes)
- Integrating with existing workflows and CI/CD pipelines
- Security best practices and considerations
- Performance optimization tips
- Real-world success stories and metrics

### Section 6: Q&A, Resources, and Next Steps (10 minutes)
- Open floor for questions
- Additional resources and learning paths
- Community engagement opportunities
- Workshop evaluation and feedback

## Key Demonstrations

### 1. "The AI Coding Partner" Demo
Show how Amazon Q CLI can:
- Generate complex code based on natural language descriptions
- Debug existing code with intelligent suggestions
- Explain unfamiliar code or AWS services
- Transform code between languages or frameworks

### 2. "Infrastructure as Conversation" Demo
Demonstrate how to:
- Design and deploy AWS infrastructure through natural language
- Get cost optimization recommendations
- Implement security best practices automatically
- Generate infrastructure diagrams from code

### 3. "Database Whisperer" Demo (using MCP)
Show how Amazon Q with PostgreSQL MCP server can:
- Explore database schemas without prior knowledge
- Generate optimized SQL queries
- Create entity-relationship diagrams
- Suggest indexes and performance improvements

## Workshop Materials

1. **Pre-workshop Setup Guide**
   - AWS account requirements
   - Software prerequisites
   - Sample code repository

2. **Workshop Handbook**
   - Step-by-step instructions
   - Challenge exercises
   - Reference commands and patterns

3. **Slide Deck**
   - Key concepts and visuals
   - Architecture diagrams
   - Success metrics and case studies

4. **GitHub Repository**
   - Starter code
   - Solution code
   - Additional examples and extensions

## Making It Viral-Worthy

### 1. Memorable Moments
- **"Mind-Reading CLI" Challenge**: Have participants write down a complex task they think would be impossible for AI, then solve it live with Amazon Q CLI
- **Speed Competition**: Time how quickly Amazon Q can solve tasks compared to manual coding
- **"CLI Magic Tricks"**: Showcase unexpected capabilities that make the audience say "wow"

### 2. Shareable Content
- Create tweetable one-liners that showcase Amazon Q's capabilities
- Design visually striking before/after comparisons
- Prepare short video clips of the most impressive demos

### 3. Personal Branding Integration
- Share your authentic journey with AI tools
- Connect Amazon Q capabilities to real problems you've faced
- Incorporate your signature teaching style and humor

## Follow-up Strategy

1. **Community Building**
   - Create a dedicated Discord/Slack channel for workshop participants
   - Schedule follow-up office hours for questions
   - Establish a hashtag for sharing Amazon Q CLI wins

2. **Content Pipeline**
   - Blog post summarizing workshop highlights
   - YouTube tutorial expanding on key concepts
   - LinkedIn article on business impact of AI-assisted development

3. **Feedback Loop**
   - Collect structured feedback on Amazon Q CLI features
   - Channel participant suggestions to the product team
   - Share success stories from workshop participants

## Workshop Differentiators

1. **Practical Over Theoretical**: Focus on real-world problems developers face daily
2. **Progressive Complexity**: Start simple, gradually introduce advanced concepts
3. **Immediate Value**: Ensure participants leave with skills they can use tomorrow
4. **Memorable Storytelling**: Frame technical concepts within compelling narratives
5. **Interactive Experience**: Minimize passive learning, maximize hands-on time

## Sample Commands and Interactions

### Basic Interactions
```bash
# Start Amazon Q CLI
q chat

# Ask for AWS service recommendations
q chat "What AWS services should I use for a serverless image processing pipeline?"

# Get code examples
q chat "Show me how to use the AWS SDK for JavaScript to upload files to S3"
```

### MCP Integration Examples
```bash
# Configure MCP in ~/.aws/amazonq/mcp.json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://USERNAME:PASSWORD@HOST:5432/DBNAME"
      ]
    },
    "awslabs.terraform-mcp-server": {
      "command": "uvx",
      "args": ["awslabs.terraform-mcp-server@latest"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      }
    }
  }
}

# Use MCP-enhanced capabilities
q chat "Generate Terraform for a secure S3 bucket with versioning"
q chat "Analyze my database schema and suggest optimizations"
```

### Advanced Features
```bash
# Use editor mode for complex prompts
q chat /editor

# Manage tool permissions
q chat /tools

# Execute commands and analyze results
q chat "Run 'aws s3 ls' and summarize the buckets"
```

## Key Takeaways for Participants

1. Amazon Q Developer CLI transforms terminal interactions from command execution to conversational problem-solving
2. MCP support extends capabilities beyond AWS to databases, infrastructure, and custom tools
3. The CLI can accelerate development across the entire application lifecycle
4. Amazon Q integrates with existing workflows rather than replacing them
5. The future of development combines human creativity with AI assistance

