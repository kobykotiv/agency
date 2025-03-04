FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install bun
RUN curl -fsSL https://bun.sh/install | bash

ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

# Install uv
RUN apt-get update && apt-get install -y python3-pip
RUN pip3 install uv

# Install dependencies
WORKDIR /workspaces/crewAI-cloner

COPY package.json bun.lock ./

RUN bun install

COPY . .

# Expose ports
EXPOSE 3000
EXPOSE 8000

# Command to start the app
CMD ["bun", "run", "dev"]