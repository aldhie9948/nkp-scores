// src/lib/ToastManager.ts
import { toast } from 'sonner';

const successMessages = {
  create: 'Data berhasil dibuat!',
  update: 'Data berhasil diperbarui!',
  delete: 'Data berhasil dihapus!',
  login: 'Login berhasil!',
  logout: 'Anda telah keluar.',
};

class ToastManager {
  success(type: 'create' | 'update' | 'delete' | 'login' | 'logout') {
    const message = successMessages[type];
    if (!message) {
      throw new Error(`Type "${type}" tidak dikenali.`);
    }
    toast.success(message, {
      duration: 3000,
    });
  }

  error(message: string) {
    toast.error(message, {
      duration: 3000,
    });
  }
}

// Export instance (optional, bisa juga langsung pakai class tanpa export)
const toastManager = new ToastManager();
export default toastManager;
