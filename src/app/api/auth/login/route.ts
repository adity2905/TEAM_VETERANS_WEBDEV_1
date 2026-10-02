import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { status: 'error', message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { status: 'error', message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const role = email.toLowerCase().includes('ngo')
      ? 'ngo'
      : email.toLowerCase().includes('admin')
      ? 'admin'
      : 'user';

    const user = {
      id: `usr-${Date.now().toString(36)}`,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      role,
      token: `demo-jwt-token-${Date.now()}`,
    };

    return NextResponse.json({
      status: 'success',
      message: 'Authentication successful',
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Authentication process failed' },
      { status: 500 }
    );
  }
}
