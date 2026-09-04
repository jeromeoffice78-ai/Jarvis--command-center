ALTER POLICY profiles_select_self_or_master ON public.profiles
USING (
  id = (SELECT auth.uid())
  OR (SELECT public.is_master_admin())
);

ALTER POLICY profiles_update_self_or_master ON public.profiles
USING (
  id = (SELECT auth.uid())
  OR (SELECT public.is_master_admin())
)
WITH CHECK (
  (
    id = (SELECT auth.uid())
    AND role = (
      SELECT p.role
      FROM public.profiles AS p
      WHERE p.id = (SELECT auth.uid())
    )
  )
  OR (SELECT public.is_master_admin())
);

ALTER POLICY matter_members_select_access ON public.matter_members
USING (
  public.can_access_matter(matter_id)
  OR user_id = (SELECT auth.uid())
);

ALTER POLICY attorney_licenses_select ON public.attorney_licenses
USING (
  attorney_id = (SELECT auth.uid())
  OR (SELECT public.current_app_role()) = ANY (
    ARRAY['MASTER_ADMIN'::public.app_role, 'FIRM_ADMIN'::public.app_role]
  )
);

ALTER POLICY subscriptions_select_self_admin ON public.subscriptions
USING (
  user_id = (SELECT auth.uid())
  OR (SELECT public.current_app_role()) = ANY (
    ARRAY['MASTER_ADMIN'::public.app_role, 'BILLING_ADMIN'::public.app_role]
  )
);

ALTER POLICY audit_insert_authenticated ON public.audit_log
WITH CHECK (
  actor_id = (SELECT auth.uid())
);
