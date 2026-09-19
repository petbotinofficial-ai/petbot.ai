import { PublicProfile } from "@/components/profile/public-profile";

export default async function PetProfilePage({ params }: PageProps<"/p/[publicId]">) {
  const { publicId } = await params;
  return <PublicProfile profileId={publicId} />;
}
