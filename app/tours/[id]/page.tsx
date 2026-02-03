import { redirect } from 'next/navigation';

export default function TourRedirect({ params }: { params: { id: string } }) {
  redirect(`/en/tours/${params.id}`);
}
