import { Label } from '@/components/ui/label';

interface StudentDetailProps {
    label: string;
    info: string | undefined;
}

export default function StudentDetail({ label, info }: StudentDetailProps) {
    return (
        <div className='flex items-center gap-2'>
            <Label className='text-xs'>{label}</Label>
            <p className='py-1 px-2 text-sm'>{info}</p>
        </div>
    );
}
