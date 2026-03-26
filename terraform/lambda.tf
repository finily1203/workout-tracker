# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "${var.app_name}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Attach DynamoDB + CloudWatch policies
resource "aws_iam_role_policy_attachment" "lambda_dynamodb" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}

# Zip Lambda functions
data "archive_file" "create_session" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/createSession"
  output_path = "${path.module}/../lambda/zips/createSession.zip"
}

data "archive_file" "get_sessions" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/getSessions"
  output_path = "${path.module}/../lambda/zips/getSessions.zip"
}

data "archive_file" "get_session" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/getSession"
  output_path = "${path.module}/../lambda/zips/getSession.zip"
}

data "archive_file" "update_session" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/updateSession"
  output_path = "${path.module}/../lambda/zips/updateSession.zip"
}

data "archive_file" "delete_session" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/deleteSession"
  output_path = "${path.module}/../lambda/zips/deleteSession.zip"
}

data "archive_file" "get_recommendation" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/getRecommendation"
  output_path = "${path.module}/../lambda/zips/getRecommendation.zip"
}

# Lambda Functions
resource "aws_lambda_function" "create_session" {
  filename         = data.archive_file.create_session.output_path
  function_name    = "createSession"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = data.archive_file.create_session.output_base64sha256
}

resource "aws_lambda_function" "get_sessions" {
  filename         = data.archive_file.get_sessions.output_path
  function_name    = "getSessions"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = data.archive_file.get_sessions.output_base64sha256
}

resource "aws_lambda_function" "get_session" {
  filename         = data.archive_file.get_session.output_path
  function_name    = "getSession"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = data.archive_file.get_session.output_base64sha256
}

resource "aws_lambda_function" "update_session" {
  filename         = data.archive_file.update_session.output_path
  function_name    = "updateSession"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = data.archive_file.update_session.output_base64sha256
}

resource "aws_lambda_function" "delete_session" {
  filename         = data.archive_file.delete_session.output_path
  function_name    = "deleteSession"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = data.archive_file.delete_session.output_base64sha256
}

resource "aws_lambda_function" "get_recommendation" {
  filename         = data.archive_file.get_recommendation.output_path
  function_name    = "getRecommendation"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = data.archive_file.get_recommendation.output_base64sha256

  environment {
    variables = {
      GROQ_API_KEY = var.groq_api_key
    }
  }
}