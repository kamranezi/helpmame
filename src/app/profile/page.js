import AuthForm from '../components/AuthForm';

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Профиль пользователя</h1>
      <AuthForm />
    </div>
  );
}
