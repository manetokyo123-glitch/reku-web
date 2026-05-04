import { getAllReku } from '@/lib/reku';
import RekuList from './components/RekuList';

export default function Home() {
  const reku = getAllReku();

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        レク一覧
        <span className="ml-2 text-base font-normal text-gray-500">全{reku.length}件</span>
      </h1>
      <RekuList reku={reku} />
    </>
  );
}
