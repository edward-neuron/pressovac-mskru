DROP POLICY IF EXISTS "Allow service role to read inquiry-attachments" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read inquiry-attachments" ON storage.objects;
DROP POLICY IF EXISTS "Service role can read inquiry-attachments" ON storage.objects;

CREATE POLICY "Service role can read inquiry-attachments"
ON storage.objects
FOR SELECT
TO service_role
USING (bucket_id = 'inquiry-attachments');

CREATE POLICY "Admins can read inquiry-attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'inquiry-attachments'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);