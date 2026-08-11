import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ContactSection } from './ContactSection'

describe('ContactSection', () => {
  it('필수 정보를 입력하면 프로토타입 성공 상태를 보여준다', async () => {
    const user = userEvent.setup()
    render(<ContactSection />)

    await user.type(screen.getByLabelText('회사명'), 'KSE 테스트')
    await user.selectOptions(screen.getByLabelText('판매 국가'), '한국')
    await user.selectOptions(screen.getByLabelText('목적지'), '일본')
    await user.selectOptions(screen.getByLabelText('화물 유형'), '이커머스 상품')
    await user.type(screen.getByLabelText('월 예상 물량'), '월 3,000건')
    await user.type(screen.getByLabelText('이메일'), 'test@example.com')
    await user.click(screen.getByRole('button', { name: '물류 상담 시작하기' }))

    expect(screen.getByRole('status')).toHaveTextContent('상담 요청이 준비되었습니다')
    expect(screen.getByText(/실제로 전송되지 않습니다/)).toBeInTheDocument()
  })
})
