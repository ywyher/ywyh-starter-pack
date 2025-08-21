import { User } from "@/lib/db/schema";
import { getSession } from "@/lib/auth-client";
import { getProfileUser } from "@/app/user/[username]/actions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { ProfileNotFound } from "@/lib/errors/profile";

export const profileQueries = createQueryKeys('profile', {
  profile: ({ username }: { username: User['name'] }) => ({
    queryKey: ['profile', username],
    queryFn: async () => {
      try {
        const [{ data }, profileUser] = await Promise.all([
          getSession(),
          getProfileUser({ username })
        ])
        
        if (!profileUser) throw new ProfileNotFound
        
        return {
          currentUser: data?.user as User,
          profileUser,
          error: null
        }
      } catch (error) {
        if (error instanceof ProfileNotFound) {
            const { data } = await getSession()

          return {
            currentUser: data?.user as User,
            profileUser: null,
            error: new ProfileNotFound()
          }
        }
        
        const msg = error instanceof Error ? error.message : "An error occurred"
        return {
          currentUser: null,
          profileUser: null,
          error: msg
        }
      }
    }
  }),
})