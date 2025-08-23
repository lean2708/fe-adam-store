# Git Workflow and Contribution Guidelines

This document outlines the Git branching model and contribution workflow for this project. We follow the principles of the [Successful Git Branching Model](https://nvie.com/posts/a-successful-git-branching-model/) to ensure a clean and manageable codebase.

## Getting Started: Initializing `git-flow`

To ensure consistency across the team, you must initialize `git-flow` with the following configuration. Run this command and follow the prompts as shown below:

```bash
git flow init -f
```

- **Branch name for production releases**: `main`
- **Branch name for "next release" development**: `develop`
- **Feature branch prefix**: `feature/`
- **Bugfix branch prefix**: `bugfix/`
- **Release branch prefix**: `release/`
- **Hotfix branch prefix**: `hotfix/`
- **Support branch prefix**: `support/`
- **Version tag prefix**: `v`

This will set up your local repository to follow the branching model used in this project.

## Core Concepts

Our repository has two main branches with an infinite lifetime:

- `main`: This branch contains production-ready code. It is always stable and deployable. Direct commits to `main` are strictly forbidden.
- `develop`: This is the primary development branch where all completed features and bugfixes are merged.
- `qa`: This branch contains features that are ready for testing. It is deployed to the QA environment.

## Branching Strategy

We use several types of supporting branches for day-to-day development. These branches have a limited lifetime and are eventually merged back into the main branches.

### 1. Feature Branches

- **Purpose**: To develop new features.
- **Branch from**: `develop`
- **Merge back into**: `develop`
- **Naming Convention**: `feature/issue-number-short-description` (e.g., `feature/123-add-user-authentication`)

### 2. Bugfix Branches

- **Purpose**: To fix non-critical bugs discovered in the `develop` branch.
- **Branch from**: `develop`
- **Merge back into**: `develop`
- **Naming Convention**: `bugfix/issue-number-fix-login-button`

### 3. Release Branches

- **Purpose**: To prepare for a new production release. This branch is deployed to the **QA environment** for final testing, bug fixing, and documentation generation.
- **Branch from**: `qa`
- **Merge back into**: `main` (with a release tag) and `develop` (to incorporate any last-minute fixes).
- **Naming Convention**: `release/v1.2.0`

### 4. Hotfix Branches

- **Purpose**: To fix critical bugs in the `main` (production) branch.
- **Branch from**: `main`
- **Merge back into**: `main` (with a new patch version tag) and `develop`.
- **Naming Convention**: `hotfix/v1.2.1`

## Contribution Workflow

Follow these steps to contribute to the project:

### Step 1: Create an Issue

Before starting work, create an issue in the project's issue tracker to describe the feature or bug. This allows for discussion and tracking.

### Step 2: Create a Branch

Create a new branch from `develop` using the appropriate naming convention:

```bash
# For a new feature
git checkout develop
git pull
git checkout -b feature/45-new-payment-gateway

# For a bugfix
git checkout develop
git pull
git checkout -b bugfix/46-fix-header-alignment
```

### Step 3: Commit Your Changes

Make your changes and commit them with clear and descriptive messages. Follow the **Conventional Commits** specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
- **Example**:

  ```
  feat: Add user login functionality

  Implement the user login form with email and password fields.
  Closes #45
  ```

### Step 4: Create a Pull Request (PR)

1.  Push your branch to the remote repository:

    ```bash
    git push -u origin feature/45-new-payment-gateway
    ```

2.  Create a Pull Request on GitHub, targeting the `develop` branch.
3.  Fill out the PR template with a clear description of your changes.

### Step 5: Assigning and Reviewing

- **Assignees**: **Le Dinh Phung** will be assigned to all new issues and pull requests to handle the technical implementation.
- **Reviewers**: **Le Van An** will be added as a reviewer to all pull requests to verify that the changes meet the requirements.

### Step 6: Code Review and Merging to `develop`

- **Code Review**: **Le Van An** is responsible for the final review and approval of all pull requests targeting `develop`. At least one approval is required before merging.
- **Conflict Resolution and Merging**: **Le Dinh Phung** is responsible for resolving any merge conflicts and merging the pull request into `develop` after it has been approved.

### Step 7: Promoting to QA

- When a set of features is ready for testing, **Le Dinh Phung** will merge the `develop` branch into the `qa` branch. This triggers a deployment to the QA environment.

  ```bash
  git checkout qa
  git pull
  git merge develop
  git push origin qa
  ```

## Deployment (Vercel)

We use Vercel for automated deployments:

- **Staging Environment**: Every push to the `develop` branch automatically deploys to a staging environment for internal review.
- **QA Environment**: Every push to the `qa` branch automatically deploys to a dedicated QA environment. This is where **Le Van An** conducts final testing before a production release.
- **Production Environment**: Every push to the `main` branch automatically deploys to the production environment.

## Release and Tagging Process

Here are the specific roles and steps for creating a new release:

1.  **QA Testing and Approval**: **Le Van An** performs thorough testing on the **QA environment**. If any bugs are found, they should be reported as new issues. **Le Dinh Phung** will fix them in a `bugfix` branch, merge it into `develop`, and then promote the changes to `qa` for re-testing.
2.  **Initiate Release**: Once the `qa` branch is stable and approved by **Le Van An**, **Le Dinh Phung** will create a `release` branch from `qa`:

    ```bash
    git checkout qa
    git pull
    git flow release start v1.2.0
    ```

3.  **Finish Release**: After approval, **Le Dinh Phung** will use `git-flow` to automate the merging and tagging process:

    ```bash
    # Finish the release. This command will:
    # 1. Merge the release branch into 'main'
    # 2. Tag the release with the version number (e.g., v1.2.0)
    # 3. Merge the release branch back into 'develop'
    # 4. Remove the release branch
    git flow release finish v1.2.0
    ```

4.  **Push Changes**: After finishing the release, **Le Dinh Phung** will push the `main` and `develop` branches, along with the new tag, to the remote repository:

    ```bash
    git push origin main
    git push origin develop
    git push origin --tags
    ```

5.  **Close Issue**: After the release is live and verified on production, **Le Van An** will close the corresponding issue(s).
