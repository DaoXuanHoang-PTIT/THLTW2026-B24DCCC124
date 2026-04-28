import moment from 'moment';

export const initialWorkouts = [
  { id: 1, name: 'Chạy bộ buổi sáng', date: moment().subtract(1, 'days').format('YYYY-MM-DD'), type: 'Cardio', duration: 45, calories: 400, notes: 'Chạy nhẹ nhàng 5km', status: 'Hoàn thành' },
  { id: 2, name: 'Tập tạ toàn thân', date: moment().subtract(2, 'days').format('YYYY-MM-DD'), type: 'Strength', duration: 60, calories: 350, notes: 'Squat, Bench press, Deadlift', status: 'Hoàn thành' },
  { id: 3, name: 'Yoga giãn cơ', date: moment().subtract(4, 'days').format('YYYY-MM-DD'), type: 'Yoga', duration: 30, calories: 150, notes: '', status: 'Hoàn thành' },
  { id: 4, name: 'HIIT đốt mỡ', date: moment().subtract(5, 'days').format('YYYY-MM-DD'), type: 'HIIT', duration: 25, calories: 450, notes: 'Rất mệt nhưng đã', status: 'Hoàn thành' },
  { id: 5, name: 'Bơi lội', date: moment().subtract(7, 'days').format('YYYY-MM-DD'), type: 'Cardio', duration: 60, calories: 500, notes: 'Hồ bơi vắng vẻ', status: 'Bỏ lỡ' },
];

export const initialMetrics = [
  { id: 1, date: moment().subtract(7, 'days').format('YYYY-MM-DD'), weight: 70.5, height: 175, restingHeartRate: 65, sleepHours: 7.5 },
  { id: 2, date: moment().subtract(6, 'days').format('YYYY-MM-DD'), weight: 70.3, height: 175, restingHeartRate: 66, sleepHours: 8 },
  { id: 3, date: moment().subtract(5, 'days').format('YYYY-MM-DD'), weight: 70.0, height: 175, restingHeartRate: 64, sleepHours: 6.5 },
  { id: 4, date: moment().subtract(2, 'days').format('YYYY-MM-DD'), weight: 69.8, height: 175, restingHeartRate: 62, sleepHours: 8 },
  { id: 5, date: moment().subtract(1, 'days').format('YYYY-MM-DD'), weight: 69.5, height: 175, restingHeartRate: 60, sleepHours: 7 },
];

export const initialGoals = [
  { id: 1, name: 'Giảm 2kg trong tháng này', type: 'Giảm cân', targetValue: 68, currentValue: 69.5, deadline: moment().add(15, 'days').format('YYYY-MM-DD'), status: 'Đang thực hiện', initialValue: 71 },
  { id: 2, name: 'Chạy liên tục 10km', type: 'Cải thiện sức bền', targetValue: 10, currentValue: 6, deadline: moment().add(30, 'days').format('YYYY-MM-DD'), status: 'Đang thực hiện', initialValue: 0 },
  { id: 3, name: 'Tăng mức đẩy tạ ngực', type: 'Tăng cơ', targetValue: 80, currentValue: 70, deadline: moment().add(45, 'days').format('YYYY-MM-DD'), status: 'Đang thực hiện', initialValue: 60 },
];

export const initialExercises = [
  { id: 1, name: 'Push Up', muscleGroup: 'Chest', difficulty: 'Dễ', description: 'Bài tập chống đẩy cơ bản, phát triển cơ ngực, vai và bắp tay sau.', caloriesPerHour: 400 },
  { id: 2, name: 'Barbell Squat', muscleGroup: 'Legs', difficulty: 'Trung bình', description: 'Gánh tạ đòn ngồi xổm. Rất tốt cho cơ đùi trước, đùi sau và mông.', caloriesPerHour: 550 },
  { id: 3, name: 'Pull Up', muscleGroup: 'Back', difficulty: 'Trung bình', description: 'Kéo xà đơn phát triển cơ xô và bắp tay trước.', caloriesPerHour: 450 },
  { id: 4, name: 'Plank', muscleGroup: 'Core', difficulty: 'Dễ', description: 'Giữ tư thế chống đẩy bằng khuỷu tay, tăng cường sức bền cơ cốt lõi.', caloriesPerHour: 250 },
  { id: 5, name: 'Deadlift', muscleGroup: 'Full Body', difficulty: 'Khó', description: 'Nâng tạ đòn từ mặt đất, bài tập toàn diện cường độ cao.', caloriesPerHour: 600 },
  { id: 6, name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders', difficulty: 'Trung bình', description: 'Đẩy tạ đơn qua đầu, phát triển cơ vai to tròn.', caloriesPerHour: 350 },
];
