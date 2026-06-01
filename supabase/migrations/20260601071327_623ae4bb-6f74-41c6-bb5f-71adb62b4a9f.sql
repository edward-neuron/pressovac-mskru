-- Drop overly permissive policies on inquiry-attachments bucket
DROP POLICY IF EXISTS "Allow public uploads to inquiry-attachments" ON storage.objects;
DROP POLICY IF EXISTS "Allow service role to read inquiry-attachments" ON storage.objects;

-- Restricted INSERT: anonymous form submissions limited to safe types and 10MB
CREATE POLICY "Restricted uploads to inquiry-attachments"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'inquiry-attachments'
  AND COALESCE((metadata->>'size')::bigint, 0) <= 10485760
  AND COALESCE(metadata->>'mimetype', '') IN (
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )
);

-- No public SELECT policy. Reads happen only via service_role
-- (signed URLs created in send-inquiry edge function), which bypasses RLS.
