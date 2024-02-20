import { NextRequest } from 'next/server';

import { getStudentNamesByTerm } from '@/lib/students';
import { studentNamesListQueryParamsSchema } from '@/lib/validations/params';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const searchTerm = searchParams.get('query');

    const query = studentNamesListQueryParamsSchema.parse(searchTerm);

    try {
        if (query.length < 4) return Response.json({ studentNames: [] });

        const studentNames = await getStudentNamesByTerm(query);

        return Response.json({ studentNames });
    } catch (error) {
        return Response.json(
            {
                error: 'Failed to fetch student names'
            },
            {
                status: 500
            }
        );
    }
}
