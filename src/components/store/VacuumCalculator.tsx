import { useState, useMemo } from 'react';
import { Calculator, Circle, Square, Zap, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

type DuctType = 'round' | 'rectangular';

interface VacuumUnit {
  name: string;
  capacity: number; // м³/час
  power: string;
  article: string;
}

// Данные вакуумных установок для рекомендаций
const vacuumUnits: VacuumUnit[] = [
  { name: 'SFU-10', capacity: 1000, power: '0,75 кВт', article: '206.003.010' },
  { name: 'SU-15', capacity: 1500, power: '1,1 кВт', article: '206.001.001' },
  { name: 'SU-24', capacity: 2400, power: '1,5 кВт', article: '206.001.009' },
  { name: 'SFU-25', capacity: 2500, power: '1,5 кВт', article: '206.003.011' },
  { name: 'SU-50 (S200)', capacity: 5000, power: '2,2 кВт', article: '206.002.006' },
  { name: 'SFU-50', capacity: 5000, power: '2,2 кВт', article: '206.003.001' },
  { name: 'SU 2,2 кВт (S300)', capacity: 5500, power: '2,2 кВт', article: '206.001.006' },
  { name: 'SU-100', capacity: 10000, power: '4 кВт', article: '206.002.100' },
  { name: 'SU-100 ASC', capacity: 10000, power: '4 кВт', article: '206.002.101' },
  { name: 'SU-7,5 кВт АТЕХ', capacity: 10000, power: '7,5 кВт', article: '206.004.006' },
];

const AIR_SPEED = 8; // м/сек - минимальные требования
const SECONDS_PER_HOUR = 3600;

export function VacuumCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [ductType, setDuctType] = useState<DuctType>('rectangular');
  const [sideA, setSideA] = useState<string>('400');
  const [sideB, setSideB] = useState<string>('400');
  const [diameter, setDiameter] = useState<string>('400');

  // Расчёт минимальной мощности
  const calculation = useMemo(() => {
    if (ductType === 'rectangular') {
      const a = parseFloat(sideA) / 1000; // мм -> м
      const b = parseFloat(sideB) / 1000;
      
      if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) return null;
      
      const crossSection = a * b; // площадь поперечного сечения в м²
      const coefficient = crossSection * AIR_SPEED;
      const minCapacity = coefficient * SECONDS_PER_HOUR;
      
      return {
        crossSection,
        coefficient,
        minCapacity: Math.round(minCapacity * 100) / 100,
        formula: `${a.toFixed(2)} × ${b.toFixed(2)} = ${crossSection.toFixed(4)} м²`,
        coeffFormula: `${crossSection.toFixed(4)} × ${AIR_SPEED} м/сек = ${coefficient.toFixed(4)}`,
        resultFormula: `${coefficient.toFixed(4)} × ${SECONDS_PER_HOUR} = ${minCapacity.toFixed(2)} м³/час`
      };
    } else {
      const d = parseFloat(diameter) / 1000; // мм -> м
      
      if (isNaN(d) || d <= 0) return null;
      
      const radius = d / 2;
      const crossSection = Math.PI * radius * radius; // π * r²
      const coefficient = crossSection * AIR_SPEED;
      const minCapacity = coefficient * SECONDS_PER_HOUR;
      
      return {
        crossSection,
        coefficient,
        minCapacity: Math.round(minCapacity * 100) / 100,
        formula: `π × (${(d/2).toFixed(2)})² = ${crossSection.toFixed(4)} м²`,
        coeffFormula: `${crossSection.toFixed(4)} × ${AIR_SPEED} м/сек = ${coefficient.toFixed(4)}`,
        resultFormula: `${coefficient.toFixed(4)} × ${SECONDS_PER_HOUR} = ${minCapacity.toFixed(2)} м³/час`
      };
    }
  }, [ductType, sideA, sideB, diameter]);

  // Подбор подходящих установок
  const recommendedUnits = useMemo(() => {
    if (!calculation) return [];
    
    return vacuumUnits
      .filter(unit => unit.capacity >= calculation.minCapacity)
      .sort((a, b) => a.capacity - b.capacity)
      .slice(0, 3);
  }, [calculation]);

  // Ближайшая установка с запасом мощности
  const bestMatch = recommendedUnits[0];

  return (
    <div className="mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full group">
            <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-display font-bold text-white text-lg">
                      Расчёт подбора установки
                    </h3>
                    <p className="text-white/80 text-sm">
                      Калькулятор по сечению воздуховода
                    </p>
                  </div>
                </div>
                <ChevronDown 
                  className={`w-6 h-6 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
              </div>
            </div>
          </button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="bg-card border border-border rounded-b-xl -mt-2 pt-6 pb-5 px-5 shadow-md space-y-5">
            {/* Выбор типа сечения */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Тип сечения воздуховода</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDuctType('rectangular')}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
                    ductType === 'rectangular'
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Square className={cn(
                    "w-6 h-6",
                    ductType === 'rectangular' ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "font-medium",
                    ductType === 'rectangular' ? "text-primary" : "text-foreground"
                  )}>
                    Прямоугольный
                  </span>
                </button>
                
                <button
                  onClick={() => setDuctType('round')}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
                    ductType === 'round'
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Circle className={cn(
                    "w-6 h-6",
                    ductType === 'round' ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "font-medium",
                    ductType === 'round' ? "text-primary" : "text-foreground"
                  )}>
                    Круглый
                  </span>
                </button>
              </div>
            </div>

            {/* Ввод размеров */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Размеры сечения</Label>
              
              {ductType === 'rectangular' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sideA" className="text-xs text-muted-foreground">
                      Сторона A, мм
                    </Label>
                    <Input
                      id="sideA"
                      type="number"
                      value={sideA}
                      onChange={(e) => setSideA(e.target.value)}
                      placeholder="400"
                      min="50"
                      max="2000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sideB" className="text-xs text-muted-foreground">
                      Сторона B, мм
                    </Label>
                    <Input
                      id="sideB"
                      type="number"
                      value={sideB}
                      onChange={(e) => setSideB(e.target.value)}
                      placeholder="400"
                      min="50"
                      max="2000"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="diameter" className="text-xs text-muted-foreground">
                    Диаметр Ø, мм
                  </Label>
                  <Input
                    id="diameter"
                    type="number"
                    value={diameter}
                    onChange={(e) => setDiameter(e.target.value)}
                    placeholder="400"
                    min="50"
                    max="2000"
                    className="max-w-[200px]"
                  />
                </div>
              )}
            </div>

            {/* Константа скорости */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              <Zap className="w-4 h-4 text-primary" />
              <span>Скорость воздушного потока: <strong className="text-foreground">8 м/сек</strong> (мин. требования)</span>
            </div>

            {calculation && (
              <div className="space-y-4 pt-2">
                {/* Минимальная мощность */}
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">Минимальная мощность установки:</p>
                  <p className="text-2xl font-bold text-primary">
                    {calculation.minCapacity.toLocaleString('ru-RU')} м³/час
                  </p>
                </div>

                {/* Рекомендованные установки */}
                {recommendedUnits.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Рекомендуемые установки:</h4>
                    <div className="space-y-2">
                      {recommendedUnits.map((unit, index) => (
                        <div
                          key={unit.article}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border",
                            index === 0
                              ? "bg-primary/5 border-primary/30"
                              : "bg-card border-border"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {index === 0 && (
                              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                                Оптимально
                              </span>
                            )}
                            <div>
                              <p className="font-medium">{unit.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {unit.capacity.toLocaleString('ru-RU')} м³/час • {unit.power}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recommendedUnits.length === 0 && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-sm">
                    <p className="font-medium text-destructive">Требуется установка повышенной мощности</p>
                    <p className="text-muted-foreground mt-1">
                      Для данного сечения рекомендуем связаться с нами для индивидуального подбора.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
