export default function ProfileCardSkeleton() {
  return (
    <div
      className="
      mb-[calc(var(--banner-height-small)-5.5rem)]
      md:mb-[calc(var(--banner-height)-5.5rem)]
    "
    >
      <div
        className="
        absolute inset-0 top-0 left-1/2 transform -translate-x-1/2
        w-full h-[var(--banner-height-small)] md:h-[var(--banner-height)]
      "
      >
        {/* Banner Skeleton */}
        <div
          className="
          absolute top-0 left-0
          w-screen h-[var(--banner-height-small)] md:h-[var(--banner-height)]
          bg-muted animate-pulse
        "
        />

        {/* Gradient Overlay */}
        <div
          className="
          absolute inset-0 
          bg-gradient-to-b 
          from-background/20 
          via-background/40 
          to-background
        "
        />

        {/* Profile Content Container */}
        <div
          className="
					h-full w-full container mx-auto px-4
					flex flex-col md:gap-10 md:flex-row justify-end md:justify-between bg-transparent
					pb-5 md:pb-10 z-20 gap-4
        "
        >
          {/* Profile Header Skeleton */}
          <div className="flex flex-row items-end gap-10">
            {/* Profile Picture Skeleton */}
            <div
              className="
              w-50 h-50 z-20
              bg-muted animate-pulse rounded-sm
              border-2 border-primary/20
            "
            />

            <div className="flex flex-col gap-2">
              {/* Display Name Skeleton */}
              <div className="z-20">
                <div
                  className="
									h-8 w-32 bg-muted animate-pulse rounded
									mb-1
								"
                />
              </div>
              {/* Username Skeleton */}
              <div className="z-20">
                <div
                  className="
									h-8 w-32 bg-muted animate-pulse rounded
									mb-1
								"
                />
              </div>
            </div>
          </div>

          {/* Profile Actions Skeleton */}
          <div
            className="
            flex flex-row md:flex-col gap-3 justify-end
            z-20
          "
          >
            <div
              className="
              h-10 w-40 bg-muted animate-pulse rounded-md
            "
            />
            <div
              className="
              h-10 w-40 bg-muted animate-pulse rounded-md
            "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
