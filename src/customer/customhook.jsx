import { useContext} from 'react';
import { AuthContext } from '../Context/AuthContext';

function useHook() {
  const {notifyAll, setNotifyAll} = useContext(AuthContext)
  return {notifyAll, setNotifyAll}
}

export default useHook;