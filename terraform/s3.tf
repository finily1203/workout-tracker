resource "aws_s3_bucket" "workout_app" {
  bucket = "${var.app_name}-frontend-${random_id.bucket_suffix.hex}"

  tags = {
    Name = "${var.app_name}-frontend"
  }
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket_public_access_block" "workout_app" {
  bucket = aws_s3_bucket.workout_app.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_website_configuration" "workout_app" {
  bucket = aws_s3_bucket.workout_app.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_policy" "workout_app" {
  bucket = aws_s3_bucket.workout_app.id
  depends_on = [aws_s3_bucket_public_access_block.workout_app]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "PublicReadGetObject"
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.workout_app.arn}/*"
    }]
  })
}