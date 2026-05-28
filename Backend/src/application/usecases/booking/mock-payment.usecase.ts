export class MockPaymentUseCase {
  async createPaymentIntent(userId: string, eventId: string, amount: number) {
    // Generate a mock client secret simulating a payment intent
    const mockClientSecret = `mock_pi_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;
    const mockPaymentId = `mock_pay_${Date.now()}`;
    
    return {
      clientSecret: mockClientSecret,
      paymentId: mockPaymentId,
      amount
    };
  }
}
