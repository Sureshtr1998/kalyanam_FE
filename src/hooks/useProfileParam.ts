import { useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const PARAM = "profile";

/**
 * Keeps the open profile in the URL (`?profile=<id>`), so the phone's back button
 * closes the profile instead of leaving the page, and the link can be shared/reloaded.
 */
export const useProfileParam = () => {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const openId = params.get(PARAM);
  const pushedHere = !!(location.state as { profileOpened?: boolean } | null)?.profileOpened;

  const openProfile = useCallback(
    (id: string) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set(PARAM, id);
          return next;
        },
        { state: { ...(location.state as object | null), profileOpened: true } }
      ),
    [setParams, location.state]
  );

  const closeProfile = useCallback(() => {
    if (!params.get(PARAM)) return;
    // Opened from this page: step back so the history has no leftover entry.
    if (pushedHere) {
      navigate(-1);
      return;
    }
    // Opened from a shared link / reload: just drop the param.
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete(PARAM);
        return next;
      },
      { replace: true }
    );
  }, [params, pushedHere, navigate, setParams]);

  return { openId, openProfile, closeProfile };
};
