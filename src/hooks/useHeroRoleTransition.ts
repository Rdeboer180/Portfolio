import { useEffect, useRef, useState } from 'react';

export type RoleInput = 'pointer' | 'keyboard';
export const HERO_ROLE_TRANSITION_MS = 400;

/** A brief presentation beat, not a network request. The latest selection wins. */
export function useHeroRoleTransition(initialRole = 0) {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [displayedRole, setDisplayedRole] = useState(initialRole);
  const [switching, setSwitching] = useState(false);
  const [input, setInput] = useState<RoleInput>('pointer');
  const selected = useRef(initialRole);
  const displayed = useRef(initialRole);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = () => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  };
  const settle = (index: number) => {
    displayed.current = index;
    setDisplayedRole(index);
    setSwitching(false);
  };
  const selectRole = (index: number, input: RoleInput = 'pointer') => {
    if (index === selected.current) return;
    cancel();
    setInput(input);
    selected.current = index;
    setSelectedRole(index);
    if (input === 'keyboard' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || index === displayed.current) {
      settle(index);
      return;
    }
    setSwitching(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      settle(index);
    }, HERO_ROLE_TRANSITION_MS);
  };

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finish = () => {
      if (!preference.matches) return;
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = null;
      displayed.current = selected.current;
      setDisplayedRole(selected.current);
      setSwitching(false);
    };
    preference.addEventListener('change', finish);
    return () => {
      if (timer.current !== null) clearTimeout(timer.current);
      preference.removeEventListener('change', finish);
    };
  }, []);

  return { selectedRole, displayedRole, switching, input, selectRole };
}
