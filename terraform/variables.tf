variable "aws_region" {
  default = "ap-southeast-1"
}

variable "app_name" {
  default = "workout-tracker"
}

variable "groq_api_key" {
  description = "Groq API key for AI recommendations"
  sensitive   = true
}