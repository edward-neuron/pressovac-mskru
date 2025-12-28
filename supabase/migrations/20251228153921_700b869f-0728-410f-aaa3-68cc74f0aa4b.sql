-- Create storage bucket for inquiry attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('inquiry-attachments', 'inquiry-attachments', false);

-- Allow anyone to upload files to the bucket (public form)
CREATE POLICY "Allow public uploads to inquiry-attachments"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'inquiry-attachments');

-- Allow service role to read files
CREATE POLICY "Allow service role to read inquiry-attachments"
ON storage.objects
FOR SELECT
USING (bucket_id = 'inquiry-attachments');