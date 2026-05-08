import { adminAc, defaultAc, userAc } from "better-auth/plugins/admin/access";

export const user = defaultAc.newRole({
  ...userAc.statements,
});

export const admin = defaultAc.newRole({
  ...adminAc.statements,
});

export const moderator = defaultAc.newRole({
  ...adminAc.statements,
});
