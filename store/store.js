'use client'
import { configureStore,createListenerMiddleware, isAnyOf  } from '@reduxjs/toolkit'
import authslice,{setSession, setUser,setUserMeta,setIsAuthenticated} from './slices/authslice'



const localStorageMiddleware = createListenerMiddleware();

localStorageMiddleware.startListening({
  matcher: isAnyOf(setSession, setUser,setUserMeta,setIsAuthenticated),
  effect: (action, listenerApi) => localStorage.setItem("auth", JSON.stringify(listenerApi.getState().auth)),
});

export const store = configureStore({
  reducer: {
    auth: authslice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(localStorageMiddleware.middleware),
})