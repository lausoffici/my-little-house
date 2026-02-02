import { NextRequest } from 'next/server';

import { getStudentNamesByTerm } from '@/lib/students';
import { studentNamesListQueryParamsSchema } from '@/lib/validations/params';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const searchTerm = searchParams.get('query');

  try {
    const query = studentNamesListQueryParamsSchema.parse(searchTerm);
    const studentNames = await getStudentNamesByTerm(query);

    return Response.json({ studentNames });
  } catch (error) {
    console.error('Failed to fetch student names:', error);
    return Response.json(
      {
        error: 'Failed to fetch student names',
        studentNames: []
      },
      {
        status: 500
      }
    );
  }
}
