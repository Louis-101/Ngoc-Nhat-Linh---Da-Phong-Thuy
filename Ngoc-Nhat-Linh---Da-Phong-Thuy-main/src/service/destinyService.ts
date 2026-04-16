export interface DestinyResult {
  name: string;
  title: string;
  description: string;
  colors: string;
  stones: string;
  advice: string;
  canChi: string;
  year: number;
}

export const calculateDestinyFromYear = (year: number): DestinyResult => {
  const cans = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const chis = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  
  const canIndex = (year - 4) % 10;
  const chiIndex = (year - 4) % 12;
  
  const canName = cans[canIndex < 0 ? canIndex + 10 : canIndex];
  const chiName = chis[chiIndex < 0 ? chiIndex + 12 : chiIndex];
  const canChi = `${canName} ${chiName}`;

  const canValues = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
  const chiValues = [0, 0, 1, 1, 2, 2, 0, 0, 1, 1, 2, 2];
  
  let elementValue = canValues[canIndex < 0 ? canIndex + 10 : canIndex] + chiValues[chiIndex < 0 ? chiIndex + 12 : chiIndex];
  if (elementValue > 5) elementValue -= 5;

  const elements: Record<number, any> = {
    1: {
      name: 'Kim',
      title: 'Vàng bạc, Kim loại',
      description: 'Người mệnh Kim thường có tính cách quyết đoán, sắc sảo và công minh. Bạn có khả năng lãnh đạo, tư duy logic và sự kiên trì đáng nể.',
      colors: 'Trắng, Xám, Ghi (Bản mệnh); Vàng, Nâu (Tương sinh)',
      stones: 'Thạch anh trắng, Thạch anh tóc vàng, Hổ phách, Kim cương, Đá mặt trăng',
      advice: 'Nên sử dụng các loại đá có màu vàng hoặc nâu để được tương sinh, mang lại tài lộc và sự vững chãi.'
    },
    2: {
      name: 'Thủy',
      title: 'Nước, Biển cả',
      description: 'Người mệnh Thủy linh hoạt, sâu sắc và có khả năng giao tiếp tốt. Bạn như dòng nước, có thể thích nghi với mọi hoàn cảnh.',
      colors: 'Đen, Xanh nước biển (Bản mệnh); Trắng, Xám, Ghi (Tương sinh)',
      stones: 'Thạch anh đen, Obsidian, Aquamarine, Sapphire xanh dương, Topaz xanh',
      advice: 'Sử dụng đá màu trắng hoặc xám sẽ giúp kích hoạt năng lượng tương sinh, mang lại sự minh mẫn và bình an.'
    },
    3: {
      name: 'Hỏa',
      title: 'Lửa, Ánh sáng',
      description: 'Người mệnh Hỏa luôn tràn đầy nhiệt huyết, đam mê và sự sáng tạo. Bạn có sức lan tỏa mạnh mẽ, thích hành động và không ngại thử thách.',
      colors: 'Đỏ, Hồng, Tím (Bản mệnh); Xanh lá (Tương sinh)',
      stones: 'Thạch anh hồng, Ruby, Thạch anh tím, Garnet, Mã não đỏ',
      advice: 'Màu xanh lá của mệnh Mộc sẽ tương sinh cho bạn, giúp nuôi dưỡng ngọn lửa đam mê và sự nghiệp bền vững.'
    },
    4: {
      name: 'Thổ',
      title: 'Đất, Núi non',
      description: 'Người mệnh Thổ vững chãi, đáng tin cậy và giàu lòng vị tha. Bạn là chỗ dựa vững chắc cho mọi người, có tính kiên nhẫn và sự ổn định cao.',
      colors: 'Vàng, Nâu (Bản mệnh); Đỏ, Hồng, Tím (Tương sinh)',
      stones: 'Thạch anh vàng, Mắt hổ, Mã não đỏ, Thạch anh tóc đỏ, San hô đỏ',
      advice: 'Nên chọn các loại đá có màu đỏ, hồng hoặc tím để được tương sinh, giúp gia tăng năng lượng và sự may mắn.'
    },
    5: {
      name: 'Mộc',
      title: 'Cây cối, Rừng xanh',
      description: 'Người mệnh Mộc ôn hòa, sáng tạo và luôn hướng tới sự phát triển. Bạn có tâm hồn nghệ sĩ, yêu thiên nhiên và có khả năng chữa lành.',
      colors: 'Xanh lá (Bản mệnh); Đen, Xanh nước biển (Tương sinh)',
      stones: 'Thạch anh xanh, Aquamarine, Sapphire, Emerald, Peridot',
      advice: 'Năng lượng từ mệnh Thủy (màu đen, xanh biển) sẽ giúp bạn sinh trưởng mạnh mẽ, gặt hái nhiều thành công.'
    }
  };

  return {
    ...elements[elementValue],
    canChi,
    year
  };
};
