import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import FindIdView from '@/views/auth/FindIdView.vue'
import FindPasswordView from '@/views/auth/FindPasswordView.vue'
import HomeView from '@/views/home/HomeView.vue'
import MypageView from '@/views/auth/MypageView.vue'
import NoticeReports from '@/views/reports/NoticeReports.vue'
import NoticeAdminList from '@/views/reports/NoticeAdminList.vue'
import NoticeList from '@/views/common/NoticeList.vue'
import NoticeForm from '@/views/reports/NoticeForm.vue'
import NoticeDetail from '@/views/common/NoticeDetail.vue'
import ProcessingStatusView from '@/views/admin/ProcessingStatusView.vue'

const routes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/find-id', name: 'findId', component: FindIdView },
    { path: '/find-password', name: 'findPassword', component: FindPasswordView },
    { path: '/mypage', name: 'mypage', component: MypageView },
    { path: '/noticeReports', name: 'noticeReports', component: NoticeReports },
    { path: '/noticeAdminList', name: 'noticeAdminList', component: NoticeAdminList },
    { path: '/noticeList', name: 'noticeList', component: NoticeList },
    { path: '/noticeForm', name: 'noticeCreate', component: NoticeForm },
    { path: '/noticeDetail', name: 'noticeDetail', component: NoticeDetail },
    { path: '/processingStatusView', name: 'processingStatusView', component: ProcessingStatusView },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const auth = useAuthStore()

    const authRequiredRoutes = []

    if (authRequiredRoutes.includes(to.name as string) && !auth.isLoggedIn) {
        next({ name: 'login' })
    } else {
        next()
    }
})

export default router
