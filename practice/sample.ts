// TypeScript & Web Practice File
// Practice:
// 1. Rename symbol across project: put cursor on 'UserProfile', press <Space>cr
// 2. Hover inspection: put cursor on 'getUserData' and press K
// 3. Jump to definition: put cursor on 'UserRole' in line 16 and press gd. Return with <Ctrl-o>
// 4. Code action: add a missing property or format with <Space>cf

export type UserRole = "admin" | "editor" | "viewer";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export async function getUserData(userId: string): Promise<UserProfile> {
  return {
    id: userId,
    name: "Eddie Chan",
    email: "eddie@example.com",
    role: "admin",
    createdAt: new Date(),
  };
}

export function formatBadge(role: UserRole): string {
  switch (role) {
    case "admin":
      return "Administrator";
    case "editor":
      return "Content Editor";
    case "viewer":
      return "Read-Only Viewer";
  }
}
