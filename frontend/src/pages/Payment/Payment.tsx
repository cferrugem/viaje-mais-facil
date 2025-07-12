import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';

const Payment: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const { state: bookingState, clearCurrentBooking } = useBooking();
  
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState<string>('');

  const currentBooking = bookingState.currentBooking;

  useEffect(() => {
    if (!authState.user) {
      navigate('/login');
      return;
    }

    if (!currentBooking) {
      navigate('/');
      return;
    }
  }, [authState.user, currentBooking, navigate]);

  const generateBookingCode = () => {
    return 'BT' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || !currentBooking) {
      return;
    }

    setProcessing(true);
    setPaymentError(null);

    const card = elements.getElement(CardElement);
    
    if (!card) {
      setPaymentError('Erro ao processar cartão');
      setProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card,
        billing_details: {
          name: `${authState.user?.firstName} ${authState.user?.lastName}`,
          email: authState.user?.email,
        },
      });

      if (paymentMethodError) {
        setPaymentError(paymentMethodError.message || 'Erro ao processar pagamento');
        setProcessing(false);
        return;
      }

      // For demo purposes - log payment method
      console.log('Payment method created:', paymentMethod?.id);

      // Simulate payment processing (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, simulate successful payment
      const newBookingCode = generateBookingCode();
      setBookingCode(newBookingCode);
      setPaymentSuccess(true);
      
      // In a real app, you would send this to your backend:
      /*
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({
          amount: currentBooking.totalAmount * 100, // Stripe expects cents
          currency: 'brl',
          payment_method: paymentMethod.id,
          booking: currentBooking
        })
      });
      
      const paymentResult = await response.json();
      
      if (paymentResult.requires_action) {
        const { error } = await stripe.confirmCardPayment(paymentResult.client_secret);
        if (error) {
          setPaymentError(error.message);
        } else {
          setPaymentSuccess(true);
        }
      } else if (paymentResult.success) {
        setPaymentSuccess(true);
      }
      */
      
    } catch (error: any) {
      setPaymentError('Erro inesperado durante o pagamento');
    } finally {
      setProcessing(false);
    }
  };

  const handleBackToDashboard = () => {
    clearCurrentBooking();
    navigate('/dashboard');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!currentBooking) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma reserva encontrada</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Pagamento Confirmado!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Sua reserva foi confirmada com sucesso.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Detalhes da Reserva</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Código da reserva:</span>
                <span className="font-mono font-bold text-primary-600">{bookingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rota:</span>
                <span>{currentBooking.trip?.route.originCity} → {currentBooking.trip?.route.destinationCity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data:</span>
                <span>{formatDate(currentBooking.trip?.departureTime || '')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Horário:</span>
                <span>{formatTime(currentBooking.trip?.departureTime || '')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Assentos:</span>
                <span>{currentBooking.seatNumbers.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total pago:</span>
                <span className="font-bold">R$ {currentBooking.totalAmount.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Um email de confirmação foi enviado para {authState.user?.email}
            </p>
            <p className="text-sm text-gray-600">
              Chegue ao ponto de embarque com 30 minutos de antecedência.
            </p>
          </div>
          
          <div className="mt-8 space-y-3">
            <button
              onClick={handleBackToDashboard}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium"
            >
              Ir para Minhas Reservas
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-medium"
            >
              Fazer Nova Reserva
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Pagamento</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dados do Cartão
              </label>
              <div className="border border-gray-300 rounded-md p-3">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                    },
                    hidePostalCode: true,
                  }}
                />
              </div>
              
              {paymentError && (
                <div className="mt-2 text-sm text-red-600">
                  {paymentError}
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-start">
                  <div className="text-blue-500 mt-0.5">ℹ️</div>
                  <div className="ml-3 text-sm text-blue-700">
                    <p className="font-medium">Para teste, use:</p>
                    <p>Cartão: 4242 4242 4242 4242</p>
                    <p>CVC: Qualquer 3 dígitos</p>
                    <p>Data: Qualquer data futura</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="terms" required className="rounded" />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  Aceito os{' '}
                  <button 
                    type="button"
                    onClick={() => navigate('/terms')}
                    className="text-primary-600 hover:underline"
                  >
                    termos e condições
                  </button>{' '}
                  e{' '}
                  <button 
                    type="button"
                    onClick={() => navigate('/privacy')}
                    className="text-primary-600 hover:underline"
                  >
                    política de privacidade
                  </button>
                </label>
              </div>

              <button
                type="submit"
                disabled={!stripe || processing}
                className={`w-full py-3 px-4 rounded-md font-medium ${
                  processing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                } text-white`}
              >
                {processing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processando...
                  </div>
                ) : (
                  `Pagar R$ ${currentBooking.totalAmount.toFixed(2).replace('.', ',')}`
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>🔒 Pagamento seguro</span>
              <span>•</span>
              <span>256-bit SSL</span>
              <span>•</span>
              <span>Powered by Stripe</span>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo da Compra</h2>
          
          <div className="space-y-4 mb-6">
            <div className="border-b pb-4">
              <h3 className="font-medium text-gray-900 mb-2">Detalhes da Viagem</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rota:</span>
                  <span>{currentBooking.trip?.route.originCity} → {currentBooking.trip?.route.destinationCity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span>{formatDate(currentBooking.trip?.departureTime || '')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Partida:</span>
                  <span>{formatTime(currentBooking.trip?.departureTime || '')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chegada:</span>
                  <span>{formatTime(currentBooking.trip?.arrivalTime || '')}</span>
                </div>
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-medium text-gray-900 mb-2">Ônibus</h3>
              <p className="text-sm text-gray-600">{currentBooking.trip?.bus.model}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {currentBooking.trip?.bus.amenities.map((amenity, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-medium text-gray-900 mb-2">Assentos</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Números:</span>
                <span>{currentBooking.seatNumbers.join(', ')}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Quantidade:</span>
                <span>{currentBooking.seatNumbers.length} passageiro(s)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span>R$ {currentBooking.totalAmount.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Taxa de serviço:</span>
                <span>R$ 0,00</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span className="text-primary-600">R$ {currentBooking.totalAmount.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Política de Cancelamento</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Cancelamento gratuito até 24h antes da viagem</li>
              <li>• 50% de reembolso até 2h antes da viagem</li>
              <li>• Sem reembolso após o horário de partida</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
