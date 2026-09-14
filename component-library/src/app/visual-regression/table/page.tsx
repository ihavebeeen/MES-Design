import { RepresentativeTable, RepresentativeTableStates } from "@/components/visual-tests/representative-table";

export default function TableVisualRegressionPage() {
  return (
    <main className="flex min-h-screen flex-col gap-8 bg-mes-gray-20 p-8">
      <RepresentativeTable />
      <RepresentativeTableStates />
    </main>
  );
}
