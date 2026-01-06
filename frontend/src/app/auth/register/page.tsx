'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '@/src/components/ui/Input';
import Button from '@/src/components/ui/Button';
import { UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register: registerUser, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
          <UserPlus className="text-white" size={32} />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Create your account</h2>
        <p className="text-gray-600">
          Or{' '}
          <Link href="/auth/login" className="text-purple-600 hover:text-purple-800 font-semibold">
            sign in to existing account
          </Link>
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            {...register('name')}
            type="text"
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message}
            disabled={isLoading}
            required
          />

          <Input
            {...register('email')}
            type="email"
            label="Email address"
            placeholder="john@example.com"
            error={errors.email?.message}
            disabled={isLoading}
            required
          />

          <Input
            {...register('password')}
            type="password"
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            helperText="Must be at least 8 characters"
            disabled={isLoading}
            required
          />

          <Input
            {...register('password_confirmation')}
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            error={errors.password_confirmation?.message}
            disabled={isLoading}
            required
          />

          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              required
              disabled={isLoading}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <Link href="/terms" className="text-purple-600 font-semibold">Terms</Link> and{' '}
              <Link href="/privacy" className="text-purple-600 font-semibold">Privacy</Link>
            </label>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading} variant="primary">
            Create account
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading registration...</p>
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
