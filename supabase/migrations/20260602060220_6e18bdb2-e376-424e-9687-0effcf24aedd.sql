DROP POLICY IF EXISTS "Admins can read inquiry-attachments" ON storage.objects;
CREATE POLICY "Admins can read inquiry-attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'inquiry-attachments'
  AND EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'::public.app_role
  )
);

DROP POLICY IF EXISTS "Admins can insert store sort order" ON public.store_sort_order;
CREATE POLICY "Admins can insert store sort order"
ON public.store_sort_order
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'::public.app_role
  )
);

DROP POLICY IF EXISTS "Admins can update store sort order" ON public.store_sort_order;
CREATE POLICY "Admins can update store sort order"
ON public.store_sort_order
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'::public.app_role
  )
);

DROP POLICY IF EXISTS "Admins can delete store sort order" ON public.store_sort_order;
CREATE POLICY "Admins can delete store sort order"
ON public.store_sort_order
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'::public.app_role
  )
);

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;