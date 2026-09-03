"""Python Practice Lab.

Practice:
1. Virtual environment picker: Press <Space>cv
2. Format and organize imports on save: Mess up the imports or indentation, save with <Space>w
3. Hover docs: Place cursor on 'dataclass' or 'calculate_average' and press K
4. Code Actions: Place cursor on unused variables and press <Space>ca
"""

from dataclasses import dataclass
from typing import Dict, List, Optional
import math
import sys


@dataclass
class ProjectStat:
    repo_name: str
    stars: int
    forks: int
    is_active: bool = True


def calculate_average(stats: List[ProjectStat]) -> float:
    """Calculate the average star count across all repositories."""
    if not stats:
        return 0.0
    total_stars = sum(s.stars for s in stats)
    return total_stars / len(stats)


if __name__ == "__main__":
    sample_data = [
        ProjectStat("neovim/neovim", 85000, 5600),
        ProjectStat("LazyVim/LazyVim", 22000, 1400),
    ]
    avg = calculate_average(sample_data)
    print(f"Average Stars: {avg:.2f}")
