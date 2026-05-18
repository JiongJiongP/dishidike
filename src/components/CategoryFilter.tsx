import { ScrollView, View, Text } from '@tarojs/components'
import { CATEGORIES } from '@/types/news'
import './CategoryFilter.scss'

interface Props {
  active: string
  onChange: (category: string) => void
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <ScrollView className='category-filter' scrollX>
      <Text
        className={`category-filter__item ${active === '' ? 'category-filter__item--active' : ''}`}
        onClick={() => onChange('')}
      >
        全部
      </Text>
      {CATEGORIES.map(cat => (
        <Text
          key={cat}
          className={`category-filter__item ${active === cat ? 'category-filter__item--active' : ''}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </Text>
      ))}
    </ScrollView>
  )
}
