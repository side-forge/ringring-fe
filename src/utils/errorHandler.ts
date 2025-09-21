// src/utils/errorHandler.ts
const ERROR_MESSAGES: Record<string, string> = {
    '4001': '잘못된 요청입니다.',
    '4002': '요청 데이터 형식이 올바르지 않습니다.',
    '4012': '존재하지 않는 아이디 입니다.',
    '4003': '아이디 또는 비밀번호가 일치하지 않습니다.',
    '4004': '존재하지 않는 사용자입니다.',
    '5001': '서버 내부 오류가 발생했습니다.',
} as const;

export const handleApiError = (error: any): string => {
    // 응답이 있는 경우
    if (error.response?.data) {
        const { code, message } = error.response.data;

        // 미리 정의된 메시지가 있으면 사용, 없으면 서버 메시지 사용
        return ERROR_MESSAGES[code] || message || '알 수 없는 오류가 발생했습니다.';
    }

    // 네트워크 오류 등
    if (error.code === 'NETWORK_ERROR') {
        return '네트워크 연결을 확인해주세요.';
    }

    if (error.code === 'TIMEOUT') {
        return '요청 시간이 초과되었습니다. 다시 시도해주세요.';
    }

    return '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
};