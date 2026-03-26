resource "aws_apigatewayv2_api" "workout_api" {
  name          = "${var.app_name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["*"]
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.workout_api.id
  name        = "$default"
  auto_deploy = true
}

# Lambda integrations
resource "aws_apigatewayv2_integration" "create_session" {
  api_id                 = aws_apigatewayv2_api.workout_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.create_session.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "get_sessions" {
  api_id                 = aws_apigatewayv2_api.workout_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_sessions.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "get_session" {
  api_id                 = aws_apigatewayv2_api.workout_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_session.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "update_session" {
  api_id                 = aws_apigatewayv2_api.workout_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.update_session.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "delete_session" {
  api_id                 = aws_apigatewayv2_api.workout_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.delete_session.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "get_recommendation" {
  api_id                 = aws_apigatewayv2_api.workout_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_recommendation.invoke_arn
  payload_format_version = "2.0"
}

# Routes
resource "aws_apigatewayv2_route" "post_sessions" {
  api_id    = aws_apigatewayv2_api.workout_api.id
  route_key = "POST /sessions"
  target    = "integrations/${aws_apigatewayv2_integration.create_session.id}"
}

resource "aws_apigatewayv2_route" "get_sessions" {
  api_id    = aws_apigatewayv2_api.workout_api.id
  route_key = "GET /sessions"
  target    = "integrations/${aws_apigatewayv2_integration.get_sessions.id}"
}

resource "aws_apigatewayv2_route" "get_session" {
  api_id    = aws_apigatewayv2_api.workout_api.id
  route_key = "GET /sessions/{sessionId}"
  target    = "integrations/${aws_apigatewayv2_integration.get_session.id}"
}

resource "aws_apigatewayv2_route" "put_session" {
  api_id    = aws_apigatewayv2_api.workout_api.id
  route_key = "PUT /sessions/{sessionId}"
  target    = "integrations/${aws_apigatewayv2_integration.update_session.id}"
}

resource "aws_apigatewayv2_route" "delete_session" {
  api_id    = aws_apigatewayv2_api.workout_api.id
  route_key = "DELETE /sessions/{sessionId}"
  target    = "integrations/${aws_apigatewayv2_integration.delete_session.id}"
}

resource "aws_apigatewayv2_route" "get_recommendation" {
  api_id    = aws_apigatewayv2_api.workout_api.id
  route_key = "POST /recommend"
  target    = "integrations/${aws_apigatewayv2_integration.get_recommendation.id}"
}

# Lambda permissions for API Gateway
resource "aws_lambda_permission" "create_session" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_session.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.workout_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "get_sessions" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_sessions.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.workout_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "get_session" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_session.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.workout_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "update_session" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.update_session.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.workout_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "delete_session" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delete_session.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.workout_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "get_recommendation" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_recommendation.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.workout_api.execution_arn}/*/*"
}