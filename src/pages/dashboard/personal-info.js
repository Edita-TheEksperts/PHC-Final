import { useEffect } from "react";
import { useRouter } from "next/router";

// F-29: the legacy 7-field personal-info form was superseded by /dashboard/formular,
// which mirrors the full booking questionnaire 1:1. Keep this route as a redirect so
// any bookmarked or in-email link still lands on the right page.
export default function PersonalInfoRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/formular");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-sm text-gray-400">Weiterleitung …</p>
    </div>
  );
}
