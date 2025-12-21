/**
 * AWS API Gateway + Lambda Configuration
 * 
 * TODO: Configure these values when you set up your AWS integration
 * 
 * Required setup:
 * 1. Create an AWS API Gateway endpoint
 * 2. Set up a Lambda function that calls Claude API
 * 3. Add the following secrets to your project:
 *    - AWS_API_GATEWAY_URL: Your API Gateway endpoint URL
 *    - AWS_API_KEY: Your API key (if using API key authentication)
 * 
 * The aira-chat edge function is already set up to receive messages
 * and deduct credits. You just need to replace the mock response
 * with the actual AWS API Gateway call.
 * 
 * Example Lambda handler structure:
 * 
 * exports.handler = async (event) => {
 *   const { message, conversationHistory } = JSON.parse(event.body);
 *   
 *   // Call Claude API with AWS Bedrock or via direct API
 *   const response = await callClaude(message, conversationHistory);
 *   
 *   return {
 *     statusCode: 200,
 *     body: JSON.stringify({ response }),
 *   };
 * };
 */

export const AWS_CONFIG = {
  // TODO: Replace with your actual API Gateway URL
  apiGatewayUrl: "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/chat",
  
  // Set to true if you're using API key authentication
  useApiKey: true,
};

/**
 * AiRA System Prompt
 * 
 * Use this as the system prompt when calling Claude
 */
export const AIRA_SYSTEM_PROMPT = `You are AiRA (AI Retirement Advisor), a knowledgeable and empathetic AI assistant specializing in retirement planning. Your role is to help users navigate their retirement journey with confidence and clarity.

Key areas of expertise:
- Social Security optimization and claiming strategies
- Investment and portfolio management for retirees
- Tax-efficient withdrawal strategies
- Healthcare and Medicare planning
- Estate planning fundamentals
- Inflation protection strategies
- Legacy and wealth transfer planning

Guidelines:
- Always be warm, patient, and encouraging
- Explain complex financial concepts in simple terms
- Acknowledge when questions require professional advice
- Never provide specific investment recommendations or tax advice
- Encourage users to consult with licensed professionals for personalized advice
- Focus on education and general guidance

Remember: You are a trusted companion on their retirement journey, not a replacement for professional financial advisors.`;
