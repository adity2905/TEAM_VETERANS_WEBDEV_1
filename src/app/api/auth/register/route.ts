import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, mobile, password, role, city, state } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { status: 'error', message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid email address format' },
        { status: 400 }
      );
    }

    const user = {
      id: `usr-${Date.now().toString(36)}`,
      name,
      email,
      phone: mobile || '',
      role: role || 'user',
      city: city || 'Pune',
      state: state || 'Maharashtra',
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        status: 'success',
        message: 'Account registered successfully',
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'User registration failed' },
      { status: 500 }
    );
  }
}
